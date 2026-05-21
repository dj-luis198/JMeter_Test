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

    var data = {"OkPercent": 99.62714392244594, "KoPercent": 0.37285607755406414};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8383968972204267, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3983050847457627, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea7d39a2-ecf8-4bcb-99ba-860e8bf9e19d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fa1b139-8110-4d3d-9bd4-c0b3e16a54e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44662262-ccb9-4ea0-9387-d9df50aeb1c0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd90bfba-be9d-4093-8431-fc681cbd6818"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b2ec878b-45d2-4891-9959-c3d58fb610af"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee57b0f9-72fb-43ba-9ad5-e965e5df4df4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1caccc90-f94b-4ad9-a62e-2dc062848a84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4943f9b0-8fcb-4224-b6e0-e64d9b31708d"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ab9d836-445b-4c03-8a55-203a0bf0f0e2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a76f9e5b-de85-4438-8d1b-bc3007d98f00"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=607346d9-5826-4d27-9f84-7e2fd67bf3e1"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a6fcc1b-8e36-49d1-99c1-938603cd4d72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b83a22c9-05db-41a1-92d3-53015ae950a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a6fcc1b-8e36-49d1-99c1-938603cd4d72"], "isController": false}, {"data": [0.94, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee57b0f9-72fb-43ba-9ad5-e965e5df4df4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd90bfba-be9d-4093-8431-fc681cbd6818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2ec878b-45d2-4891-9959-c3d58fb610af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9fa1b139-8110-4d3d-9bd4-c0b3e16a54e9"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e5384917-e4af-4a82-8269-0eee43cd7f73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4943f9b0-8fcb-4224-b6e0-e64d9b31708d"], "isController": false}, {"data": [0.43548387096774194, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8220338983050848, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9726775956284153, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44662262-ccb9-4ea0-9387-d9df50aeb1c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/607346d9-5826-4d27-9f84-7e2fd67bf3e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5384917-e4af-4a82-8269-0eee43cd7f73"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a76f9e5b-de85-4438-8d1b-bc3007d98f00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a53d8fa6-dac0-4056-8d7d-394962a726a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94782451-9354-46f8-8392-806e19851ae6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea7d39a2-ecf8-4bcb-99ba-860e8bf9e19d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.94, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8fe21a5-7c49-4525-9979-42db49dd52bc"], "isController": false}, {"data": [0.96, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1341, 5, 0.37285607755406414, 301.24757643549594, 77, 4000, 95.0, 840.0, 1021.0, 1639.5799999999927, 5.284395860753608, 748.2979367557119, 3.8657045270051937], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1311.0677966101696, 1015, 1849, 1269.0, 1583.0, 1647.0, 1849.0, 0.2539786399659066, 305.61961539723984, 1.248810988504238], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea7d39a2-ecf8-4bcb-99ba-860e8bf9e19d", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fa1b139-8110-4d3d-9bd4-c0b3e16a54e9", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44662262-ccb9-4ea0-9387-d9df50aeb1c0", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd90bfba-be9d-4093-8431-fc681cbd6818", 1, 0, 0.0, 1581.0, 1581, 1581, 1581.0, 1581.0, 1581.0, 1581.0, 0.6325110689437066, 0.1142720192915876, 0.4360867330803289], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 546.7272727272727, 395, 997, 456.0, 935.2000000000003, 997.0, 997.0, 0.06390036190841335, 0.011544498977594209, 0.0434322772346247], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 546.7272727272727, 395, 997, 456.0, 935.2000000000003, 997.0, 997.0, 0.06227073049227843, 0.011250083145577646, 0.04232463713147049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 123.92857142857144, 78, 236, 80.5, 235.5, 236.0, 236.0, 0.07793451274229282, 0.020853570792371323, 0.04444702679833888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 91.49999999999999, 78, 235, 80.0, 159.5, 235.0, 235.0, 0.07793451274229282, 0.05791812909852036, 0.03911947221634621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 135.21428571428572, 79, 237, 80.5, 236.0, 237.0, 237.0, 0.07793494658672769, 0.021005903572203943, 0.045893332804489054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 123.42857142857142, 78, 238, 79.0, 236.0, 238.0, 238.0, 0.07793538043599278, 0.02100602050813868, 0.045817479514128574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2ec878b-45d2-4891-9959-c3d58fb610af", 3, 0, 0.0, 951.3333333333333, 241, 2186, 427.0, 2186.0, 2186.0, 2186.0, 0.017702874946891375, 0.024404842252631828, 0.011352429572062502], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 235.9090909090909, 165, 412, 200.0, 394.00000000000006, 412.0, 412.0, 0.06403241204275037, 0.1646515254266887, 0.04139595387919994], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee57b0f9-72fb-43ba-9ad5-e965e5df4df4", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.0323660714285714, 3.9397321428571432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 81.85714285714286, 79, 91, 80.0, 89.5, 91.0, 91.0, 0.13787126762782637, 0.10246097135232018, 0.06920491363349877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 92.14285714285714, 78, 248, 79.5, 166.5, 248.0, 248.0, 0.137875340995263, 0.051684018032124954, 0.07780493224411814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 513.6666666666666, 458, 615, 468.0, 615.0, 615.0, 615.0, 0.15710919088766692, 46.19531863707777, 0.08960133542812256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 885.3333333333334, 699, 1102, 855.0, 1102.0, 1102.0, 1102.0, 0.1539882968894364, 138.558940223668, 0.08767107137357562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 236.33333333333334, 234, 238, 237.0, 238.0, 238.0, 238.0, 0.1590246488205672, 0.2813990856082693, 0.08805368738404454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 80.81818181818183, 79, 83, 81.0, 82.8, 83.0, 83.0, 0.05400389809955373, 0.04013375630250038, 0.027107425413252558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 109.09090909090908, 78, 242, 81.0, 240.4, 242.0, 242.0, 0.054004163230038094, 0.021824125623502614, 0.030386930624288128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 193.1818181818182, 78, 854, 82.0, 730.0000000000005, 854.0, 854.0, 0.053963099051721176, 4.427412618105601, 0.031302813317111704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 129.36363636363637, 78, 463, 80.0, 417.20000000000016, 463.0, 463.0, 0.05400442836312577, 1.45678671503336, 0.03137952624615218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1caccc90-f94b-4ad9-a62e-2dc062848a84", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.144573252688172, 2.1386368727598564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 80.33333333333333, 78, 83, 80.0, 83.0, 83.0, 83.0, 0.16035920461834507, 0.11917319796343812, 0.09004545181205902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4943f9b0-8fcb-4224-b6e0-e64d9b31708d", 3, 0, 0.0, 327.0, 233, 429, 319.0, 429.0, 429.0, 429.0, 0.04011177815512562, 0.033439539015389555, 0.025722722319530426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 128.42857142857142, 77, 749, 80.0, 417.5, 749.0, 749.0, 0.13787398317937405, 8.895882138056173, 0.0802084974690276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 515.6315789473684, 78, 1094, 763.0, 1006.0, 1094.0, 1094.0, 0.0907306683985082, 42.97980220415833, 0.049235937343310526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 104.64285714285715, 78, 426, 80.0, 254.5, 426.0, 426.0, 0.13787262539022876, 2.9301587443250643, 0.08034234880789419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 378.8947368421053, 79, 772, 460.0, 718.0, 772.0, 772.0, 0.09073110166658707, 14.052613592951626, 0.04932477705219426], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 543.2727272727273, 175, 1581, 403.0, 1432.8000000000006, 1581.0, 1581.0, 0.06230353147744329, 0.011256009104811532, 0.04295536447565914], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 275.45454545454544, 160, 938, 164.0, 813.6000000000004, 938.0, 938.0, 0.053941664541692004, 5.942634035841784, 0.12006138775965555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ab9d836-445b-4c03-8a55-203a0bf0f0e2", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 1.5887360074626864, 2.96855565920398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 555.0, 143, 1328, 475.5, 1041.1000000000006, 1314.9999999999998, 1328.0, 0.0908343590046371, 0.055795714662028054, 0.04107061349526071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 81.94736842105263, 78, 93, 81.0, 89.0, 93.0, 93.0, 0.09072893536757157, 0.06742648419406443, 0.04554167263567557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 147.9473684210526, 78, 248, 81.0, 245.0, 248.0, 248.0, 0.0907306683985082, 0.09600028472716333, 0.04773432985850791], "isController": false}, {"data": ["login", 20, 0, 0.0, 2770.5, 1547, 4540, 2746.5, 4185.000000000001, 4524.65, 4540.0, 0.09172334404967737, 16.588663904743015, 0.16120556863887145], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 97.71428571428572, 81, 240, 84.5, 173.5, 240.0, 240.0, 0.12509717369742568, 0.10127495800309169, 0.04446813596275678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a76f9e5b-de85-4438-8d1b-bc3007d98f00", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=607346d9-5826-4d27-9f84-7e2fd67bf3e1", 1, 0, 0.0, 840.0, 840, 840, 840.0, 840.0, 840.0, 840.0, 1.1904761904761907, 0.21507626488095238, 0.8207775297619048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 611.5263157894736, 160, 1180, 842.0, 1090.0, 1180.0, 1180.0, 0.09069428864650708, 57.1728432883243, 0.19176043133487672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a6fcc1b-8e36-49d1-99c1-938603cd4d72", 3, 0, 0.0, 315.6666666666667, 200, 377, 370.0, 377.0, 377.0, 377.0, 0.02269426289034132, 0.026823850441025174, 0.014553287074860808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b83a22c9-05db-41a1-92d3-53015ae950a0", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.9229362355491331, 1.7245077673410405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 283.07142857142856, 160, 470, 314.0, 396.5, 470.0, 470.0, 0.0778993873769607, 0.12072883571019202, 0.17519754797767625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 966.3333333333334, 780, 1181, 938.0, 1181.0, 1181.0, 1181.0, 0.15335071308081583, 183.46076617850025, 0.34578788721055054], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1246.2380952380954, 199, 4000, 1157.0, 2160.0000000000005, 3830.899999999998, 4000.0, 0.08401411437121437, 0.02667635662791349, 0.03790480550732523], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 223.35714285714283, 159, 829, 162.5, 584.5, 829.0, 829.0, 0.13776137761377613, 11.970431657441575, 0.3073108856088561], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 88.3529411764706, 80, 136, 83.0, 115.19999999999999, 136.0, 136.0, 0.1341032437208128, 0.10411335816215449, 0.04766951241638268], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a6fcc1b-8e36-49d1-99c1-938603cd4d72", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 25, 0, 0.0, 323.88, 160, 1116, 169.0, 975.8000000000002, 1087.8, 1116.0, 0.12776091333721726, 18.515820234645695, 0.2834146291995012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee57b0f9-72fb-43ba-9ad5-e965e5df4df4", 3, 0, 0.0, 389.6666666666667, 376, 412, 381.0, 412.0, 412.0, 412.0, 0.1124564231360348, 0.05088360291636991, 0.07211560988866814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd90bfba-be9d-4093-8431-fc681cbd6818", 3, 0, 0.0, 265.0, 167, 436, 192.0, 436.0, 436.0, 436.0, 0.025537565759231832, 0.02561238284641708, 0.01637662908388239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 81.90909090909092, 79, 88, 81.0, 87.0, 88.0, 88.0, 0.05555443324377285, 0.041286058299327286, 0.02788572137431567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 107.0909090909091, 78, 233, 79.0, 232.8, 233.0, 233.0, 0.05555583614058657, 0.014865526467305391, 0.03168418779892828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 108.00000000000001, 78, 235, 80.0, 235.0, 235.0, 235.0, 0.05555555555555556, 0.014973958333333334, 0.032660590277777776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 79.54545454545456, 78, 83, 80.0, 82.6, 83.0, 83.0, 0.0555561167284518, 0.014974109586965526, 0.03271517420630512], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 902.7627118644069, 624, 1495, 853.0, 1242.0, 1284.0, 1495.0, 0.2697525134990559, 322.71778729214196, 0.5326558420850498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1246.2380952380954, 199, 4000, 1157.0, 2160.0000000000005, 3830.899999999998, 4000.0, 0.08596868283696654, 0.0272969757445502, 0.03878665182683451], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2ec878b-45d2-4891-9959-c3d58fb610af", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 96.4, 78, 240, 80.5, 224.40000000000006, 240.0, 240.0, 0.049268122046991936, 0.013279298520478294, 0.029012380463218884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 79.9, 78, 82, 80.0, 82.0, 82.0, 82.0, 0.049267636582205517, 0.01327916767254758, 0.028963981662585663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 181.94117647058823, 78, 714, 80.0, 701.2, 714.0, 714.0, 0.12854733944815386, 13.63846805126014, 0.07427212432040045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 162.1176470588235, 77, 629, 80.0, 622.6, 629.0, 629.0, 0.1283968520112989, 4.4720576350810415, 0.07431056319013309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 95.3, 77, 237, 80.0, 221.40000000000006, 237.0, 237.0, 0.049267636582205517, 0.013182941819847959, 0.02809794898828908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 99.94117647058822, 79, 243, 80.0, 239.8, 243.0, 243.0, 0.12854442344045366, 0.09552959593572778, 0.06452327504725898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 81.3, 80, 87, 81.0, 86.5, 87.0, 87.0, 0.04926715112698608, 0.03661357617933243, 0.024729800468037938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 126.64705882352939, 77, 240, 80.0, 239.2, 240.0, 240.0, 0.12839782176871775, 0.05704439071457164, 0.07195824616128277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 89.4, 80, 127, 82.5, 123.9, 127.0, 127.0, 0.051539484398998074, 0.040567211353117624, 0.018320676094956346], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 471.0, 370, 976, 429.0, 878.8000000000004, 976.0, 976.0, 0.0608821266680319, 0.010999212337486233, 0.041440275671502186], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9fa1b139-8110-4d3d-9bd4-c0b3e16a54e9", 3, 0, 0.0, 726.0, 322, 1414, 442.0, 1414.0, 1414.0, 1414.0, 0.03447443720481263, 0.0287399198182048, 0.02210763062938831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1538.75, 973, 2493, 1418.0, 2322.2000000000007, 2486.2999999999997, 2493.0, 0.09023764082711822, 0.0467050289437233, 0.04150578987262957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5384917-e4af-4a82-8269-0eee43cd7f73", 3, 0, 0.0, 987.3333333333333, 165, 2383, 414.0, 2383.0, 2383.0, 2383.0, 0.026040988515924065, 0.02611728047446681, 0.01669946203657891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 178.70000000000002, 160, 322, 162.5, 306.9000000000001, 322.0, 322.0, 0.04924774075989264, 0.07632437947846642, 0.1107593232129226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4943f9b0-8fcb-4224-b6e0-e64d9b31708d", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["addBook", 62, 1, 1.6129032258064515, 946.0967741935482, 418, 3343, 701.5, 1577.1000000000001, 2429.0499999999947, 3343.0, 0.29057641925490585, 96.38491408955846, 1.0570834007048822], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 139.49152542372883, 79, 340, 82.0, 321.0, 334.0, 340.0, 0.27052307240848067, 0.20104302549106814, 0.1307704305099589], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 509.8305084745763, 388, 719, 470.0, 643.0, 702.0, 719.0, 0.27040900507818943, 79.50922591698443, 0.13599671642115974], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 115.84745762711864, 78, 321, 83.0, 241.0, 245.0, 321.0, 0.27088948168282057, 0.4793474031340536, 0.13174117370902796], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 760.0677966101696, 538, 1117, 766.0, 958.0, 1016.0, 1117.0, 0.27021951900925617, 243.14399819977695, 0.13563753200269302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 25, 0, 0.0, 104.04, 80, 248, 82.0, 238.60000000000002, 245.9, 248.0, 0.12931591878960302, 0.09660808386137335, 0.04596776800724169], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 1, 0.546448087431694, 174.77049180327867, 78, 2137, 89.0, 290.6, 418.5999999999996, 1853.919999999999, 0.8005564523537672, 1.67755350303599, 0.3865220798281647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 116.63636363636364, 79, 264, 86.0, 258.40000000000003, 264.0, 264.0, 0.05408993681311927, 0.04188800770781599, 0.019227282226538488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44662262-ccb9-4ea0-9387-d9df50aeb1c0", 3, 0, 0.0, 293.6666666666667, 207, 444, 230.0, 444.0, 444.0, 444.0, 0.017911624046952335, 0.024680958525634518, 0.011486295368651075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 82.5, 79, 92, 82.0, 89.0, 92.0, 92.0, 0.08143654057575635, 0.066087661346146, 0.028948145282788385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/607346d9-5826-4d27-9f84-7e2fd67bf3e1", 3, 0, 0.0, 464.33333333333337, 178, 976, 239.0, 976.0, 976.0, 976.0, 0.02105218837498158, 0.024882973954934284, 0.013500264029529203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 191.36363636363637, 159, 323, 163.0, 322.0, 323.0, 323.0, 0.05553199652672603, 0.08606374852335373, 0.12489276171977545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 301.29411764705884, 158, 957, 172.0, 813.7999999999998, 957.0, 957.0, 0.12831544465075556, 18.23545418242305, 0.28472200600440806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5384917-e4af-4a82-8269-0eee43cd7f73", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a76f9e5b-de85-4438-8d1b-bc3007d98f00", 3, 0, 0.0, 667.3333333333334, 181, 1331, 490.0, 1331.0, 1331.0, 1331.0, 0.03392859162416168, 0.028284870816887388, 0.021757592936067223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a53d8fa6-dac0-4056-8d7d-394962a726a1", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.8784466911764706, 3.5098805147058822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 101.63636363636364, 80, 237, 83.0, 213.60000000000008, 237.0, 237.0, 0.05356786317793783, 0.04441319906061447, 0.019041701364032586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94782451-9354-46f8-8392-806e19851ae6", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea7d39a2-ecf8-4bcb-99ba-860e8bf9e19d", 3, 0, 0.0, 262.3333333333333, 180, 370, 237.0, 370.0, 370.0, 370.0, 0.020135174135697653, 0.02379909416885357, 0.012912204768009236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 104.94736842105263, 80, 247, 86.0, 240.0, 247.0, 247.0, 0.08964293802370348, 0.06959583567269947, 0.031865263125613344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 25, 0, 0.0, 94.44, 79, 245, 81.0, 150.40000000000032, 243.8, 245.0, 0.12791911418571808, 0.09506488856965963, 0.06420939911275302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 25, 0, 0.0, 130.32, 78, 243, 80.0, 241.4, 242.7, 243.0, 0.12781774212514893, 0.057238382645418244, 0.07160789287339396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 25, 0, 0.0, 202.52, 78, 942, 80.0, 867.0, 920.4, 942.0, 0.12792500524492523, 13.84319956268837, 0.07388668466997908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8fe21a5-7c49-4525-9979-42db49dd52bc", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 25, 0, 0.0, 163.52, 78, 625, 80.0, 524.8000000000004, 625.0, 625.0, 0.12792435065599606, 4.544022846649406, 0.07401123271742023], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 80.0, 0.29828486204325133], "isController": false}, {"data": ["401/Unauthorized", 1, 20.0, 0.07457121551081283], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1341, 5, "406/Not Acceptable", 4, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
