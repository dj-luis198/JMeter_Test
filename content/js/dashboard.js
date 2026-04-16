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

    var data = {"OkPercent": 98.75, "KoPercent": 1.25};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8189600507292327, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3559322033898305, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91b5fdc6-df88-4b39-be96-03aaf27ea151"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ed2d9da-2028-4a1d-b008-59ab18bef9ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6eb09b0-e781-4f37-8266-4eec0819771a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cc98f84f-3e58-42e5-a0ea-cd21caf9545f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a6aeea1-ec05-4ecc-ab1b-a46566ec9ca0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=149687be-864f-4de1-bef7-3969eef7afbb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=395f8f4a-d626-45ab-9fe0-6aede3745a90"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5b6c739-9816-4d76-a775-acca981f996b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f666e7a7-b8dd-4dc2-b6b0-792df1462f57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/277ccbe0-03c7-491d-a9e1-c8eb1c204666"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea796e65-50fd-4587-817a-c784fd5b4825"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39b11f6f-6ded-48a8-84eb-04306579e117"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ed2d9da-2028-4a1d-b008-59ab18bef9ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9805aa9a-1bbd-4d84-ba6c-dd63c2f6b78c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/757ea1cf-96eb-422d-92e5-713afe00823f"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=130050f9-9d0d-48f9-9d99-5a806e9e407f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da8d194d-9f40-43fd-8cb4-512ad87e6186"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/149687be-864f-4de1-bef7-3969eef7afbb"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=277ccbe0-03c7-491d-a9e1-c8eb1c204666"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5b6c739-9816-4d76-a775-acca981f996b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=757ea1cf-96eb-422d-92e5-713afe00823f"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91b5fdc6-df88-4b39-be96-03aaf27ea151"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7372881355932204, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b6eb09b0-e781-4f37-8266-4eec0819771a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/395f8f4a-d626-45ab-9fe0-6aede3745a90"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9553072625698324, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da8d194d-9f40-43fd-8cb4-512ad87e6186"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ea796e65-50fd-4587-817a-c784fd5b4825"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f666e7a7-b8dd-4dc2-b6b0-792df1462f57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/130050f9-9d0d-48f9-9d99-5a806e9e407f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1360, 17, 1.25, 306.6669117647056, 81, 2027, 103.5, 892.8000000000002, 1032.95, 1373.3400000000006, 5.470261486543559, 783.05757371655, 4.007124443672396], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1428.1525423728813, 1013, 1888, 1395.0, 1714.0, 1796.0, 1888.0, 0.2592984877184809, 312.0240128528547, 1.2749686383423355], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91b5fdc6-df88-4b39-be96-03aaf27ea151", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.3302816499085923, 1.2604261882998171], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 476.6153846153846, 95, 1064, 394.0, 968.3999999999999, 1064.0, 1064.0, 0.0946163307786924, 0.01792535954205696, 0.06396126507492886], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 476.6153846153846, 95, 1064, 394.0, 968.3999999999999, 1064.0, 1064.0, 0.09171334640836426, 0.017375380081272134, 0.06199882845018554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 129.66666666666666, 82, 257, 86.0, 256.4, 257.0, 257.0, 0.08639905997822743, 0.04042081022158479, 0.04830697442011831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 86.93333333333331, 83, 93, 87.0, 91.2, 93.0, 93.0, 0.0864832453126081, 0.06427123992470192, 0.043410535244805246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 185.60000000000002, 83, 672, 87.0, 565.2, 672.0, 672.0, 0.08639706941140557, 3.407329423385959, 0.049886432852197654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 240.46666666666667, 81, 972, 88.0, 894.6, 972.0, 972.0, 0.08648075226723706, 10.39560575082589, 0.04985029821446073], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 316.2307692307692, 89, 1584, 188.0, 1135.9999999999995, 1584.0, 1584.0, 0.0953344773470615, 0.20773491469397634, 0.06162508845939485], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6ed2d9da-2028-4a1d-b008-59ab18bef9ef", 3, 0, 0.0, 353.0, 196, 464, 399.0, 464.0, 464.0, 464.0, 0.07508634930169694, 0.03324135255543875, 0.0481510768633929], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6eb09b0-e781-4f37-8266-4eec0819771a", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc98f84f-3e58-42e5-a0ea-cd21caf9545f", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 1.2188394561068703, 2.27740338740458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 88.14285714285715, 82, 105, 88.0, 95.4, 104.1, 105.0, 0.15914395707660128, 0.11827006966337265, 0.07988280657946589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a6aeea1-ec05-4ecc-ab1b-a46566ec9ca0", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.9237104668674698, 3.5944559487951806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 87.85714285714283, 82, 108, 87.0, 95.60000000000001, 106.89999999999998, 108.0, 0.15914636918926292, 0.04258408706822074, 0.0907631636782515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 585.7142857142857, 511, 702, 516.0, 702.0, 702.0, 702.0, 0.08202099737532809, 24.116896581774935, 0.0467776000656168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 933.0000000000001, 755, 1062, 949.0, 1062.0, 1062.0, 1062.0, 0.08192308592561384, 73.71453672129181, 0.04664175692835241], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 159.28571428571428, 85, 259, 91.0, 259.0, 259.0, 259.0, 0.08240432269532767, 0.14581702414446654, 0.04562817477368241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 87.8235294117647, 83, 92, 87.0, 91.2, 92.0, 92.0, 0.08409180846853977, 0.06249401000445192, 0.042210146047685006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 135.23529411764707, 83, 261, 89.0, 258.6, 261.0, 261.0, 0.08409388835299647, 0.022501684969454133, 0.047959795701318295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 96.23529411764707, 84, 263, 85.0, 123.79999999999987, 263.0, 263.0, 0.08409305638686763, 0.022665706604272914, 0.049437519477435854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=149687be-864f-4de1-bef7-3969eef7afbb", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 142.41176470588235, 83, 346, 88.0, 278.79999999999995, 346.0, 346.0, 0.08409180846853977, 0.02266537025128611, 0.0495189067446577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 88.57142857142857, 85, 96, 87.0, 96.0, 96.0, 96.0, 0.08256859090801859, 0.06136200945410365, 0.04636419899620184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 831.25, 87, 1150, 929.5, 1136.8, 1150.0, 1150.0, 0.09744689144416292, 73.07344767609464, 0.0503094953875138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 88.33333333333333, 83, 115, 87.0, 98.0, 113.49999999999997, 115.0, 0.15915119363395225, 0.0428962201591512, 0.09356349469496023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 607.6666666666666, 248, 771, 697.5, 762.0, 771.0, 771.0, 0.09730939522210869, 23.847865629916154, 0.05033353808851911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 102.52380952380953, 82, 257, 86.0, 218.8000000000001, 256.0, 257.0, 0.1591451631237922, 0.042894594748209613, 0.09371536461293622], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 405.00000000000006, 116, 615, 412.0, 587.8, 615.0, 615.0, 0.0919020183097098, 0.017411124562581738, 0.06285816381534763], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 251.35294117647058, 172, 433, 181.0, 365.79999999999995, 433.0, 433.0, 0.08405480373203328, 0.13026852883079768, 0.18904122362780534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=395f8f4a-d626-45ab-9fe0-6aede3745a90", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 493.3478260869565, 131, 1138, 456.0, 1095.4, 1131.0, 1138.0, 0.10058338362502514, 0.06178412919935627, 0.04547861974451821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 88.5, 84, 95, 87.0, 94.7, 95.0, 95.0, 0.09744768277531, 0.07241961581251066, 0.04891416889307553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5b6c739-9816-4d76-a775-acca981f996b", 3, 0, 0.0, 359.33333333333337, 172, 704, 202.0, 704.0, 704.0, 704.0, 0.01926237928908979, 0.0265547448858383, 0.01235250234358948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 157.49999999999997, 82, 267, 89.5, 265.5, 267.0, 267.0, 0.09745243103210245, 0.1480502915451895, 0.04875793831261116], "isController": false}, {"data": ["login", 23, 0, 0.0, 2131.6956521739125, 1043, 3656, 2173.0, 2926.4000000000005, 3551.1999999999985, 3656.0, 0.09798241428668802, 35.80863265673992, 0.197283630599908], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 128.28571428571428, 87, 269, 95.0, 259.4, 268.09999999999997, 269.0, 0.1525331396404576, 0.12348630152533138, 0.05422076448156891], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f666e7a7-b8dd-4dc2-b6b0-792df1462f57", 3, 0, 0.0, 278.3333333333333, 188, 422, 225.0, 422.0, 422.0, 422.0, 0.039185464804921695, 0.032667309689259266, 0.025128699760968664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/277ccbe0-03c7-491d-a9e1-c8eb1c204666", 3, 0, 0.0, 304.0, 215, 477, 220.0, 477.0, 477.0, 477.0, 0.02465381928750462, 0.024726047273698485, 0.015809903644656283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea796e65-50fd-4587-817a-c784fd5b4825", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39b11f6f-6ded-48a8-84eb-04306579e117", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ed2d9da-2028-4a1d-b008-59ab18bef9ef", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 0.705718994140625, 2.69317626953125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9805aa9a-1bbd-4d84-ba6c-dd63c2f6b78c", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.7740885416666667, 3.3148871527777777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/757ea1cf-96eb-422d-92e5-713afe00823f", 3, 0, 0.0, 266.0, 175, 364, 259.0, 364.0, 364.0, 364.0, 0.042366897330885465, 0.027237832756672787, 0.027168876218048296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 949.8333333333334, 349, 1234, 1017.5, 1223.8, 1234.0, 1234.0, 0.09724000453786688, 96.96916010465455, 0.19796191027988913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 372.6666666666667, 169, 1057, 340.0, 981.4000000000001, 1057.0, 1057.0, 0.08635528868573007, 13.890782283564862, 0.19126909351414212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 814.8888888888889, 89, 1147, 1019.0, 1147.0, 1147.0, 1147.0, 0.10522131550026889, 97.91391434984918, 0.20003010498749035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=130050f9-9d0d-48f9-9d99-5a806e9e407f", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da8d194d-9f40-43fd-8cb4-512ad87e6186", 3, 0, 0.0, 457.6666666666667, 174, 1006, 193.0, 1006.0, 1006.0, 1006.0, 0.043670664958658435, 0.028076029717887505, 0.028004951161639688], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 802.4782608695654, 170, 1825, 794.0, 1454.2000000000007, 1786.1999999999994, 1825.0, 0.0956484130680684, 0.029987596896001063, 0.04315387386469492], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 194.33333333333334, 170, 346, 177.0, 305.6000000000001, 344.59999999999997, 346.0, 0.15903669203680565, 0.24647581080313533, 0.3576772478132455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 92.17647058823529, 85, 108, 91.0, 100.0, 108.0, 108.0, 0.10724672424343745, 0.08326283766946559, 0.03812285900840941], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/149687be-864f-4de1-bef7-3969eef7afbb", 3, 0, 0.0, 843.3333333333333, 189, 1790, 551.0, 1790.0, 1790.0, 1790.0, 0.036230133809960874, 0.030203571838316987, 0.023233516798705375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 364.1176470588236, 170, 963, 339.0, 924.5999999999999, 963.0, 963.0, 0.08634394348027041, 12.270705444303077, 0.19159050464225671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 100.75, 83, 250, 87.5, 202.00000000000017, 250.0, 250.0, 0.056142452115166885, 0.04172305279261914, 0.02818087928437088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 100.33333333333334, 82, 255, 87.5, 205.20000000000016, 255.0, 255.0, 0.056142452115166885, 0.01502249206987864, 0.032018742221931115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 128.08333333333334, 82, 265, 87.5, 262.0, 265.0, 265.0, 0.056142714780973234, 0.01513221609330919, 0.03300577568178309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 128.58333333333334, 82, 263, 87.0, 260.90000000000003, 263.0, 263.0, 0.05614140147651885, 0.015131862116717973, 0.033059829189786005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 116.0, 116, 116, 116.0, 116.0, 116.0, 116.0, 8.620689655172413, 2.5424299568965516, 5.329000538793103], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 975.3898305084746, 659, 1533, 931.0, 1334.0, 1425.0, 1533.0, 0.2610862071254409, 312.3498719737232, 0.5155432722730873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 802.4782608695654, 170, 1825, 794.0, 1454.2000000000007, 1786.1999999999994, 1825.0, 0.09832379307544, 0.030826379418692637, 0.044360930078958284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 105.625, 83, 245, 87.0, 245.0, 245.0, 245.0, 0.041336192419975715, 0.01114139561319658, 0.024341527372309917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 106.5, 82, 243, 88.5, 243.0, 243.0, 243.0, 0.04133533809723105, 0.011141165346519306, 0.024300657748567475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 201.41176470588235, 84, 1026, 89.0, 409.99999999999943, 1026.0, 1026.0, 0.1149611836944467, 6.114002663126538, 0.06700345644323623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 130.76470588235293, 83, 513, 87.0, 300.1999999999998, 513.0, 513.0, 0.11495962888326865, 2.017512430009873, 0.06711481550670148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 126.87499999999999, 82, 252, 87.5, 252.0, 252.0, 252.0, 0.041300980898296334, 0.01105123902942695, 0.02355446566855963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 123.5294117647059, 84, 358, 88.0, 280.3999999999999, 358.0, 358.0, 0.11495651938707889, 0.08543155395856156, 0.05770278414546733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 110.875, 84, 262, 89.5, 262.0, 262.0, 262.0, 0.04133448380979937, 0.030718302909430978, 0.0207479733185907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 126.17647058823529, 82, 263, 86.0, 260.6, 263.0, 263.0, 0.11495729674535606, 0.040916556217499206, 0.0649936646695654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 89.375, 84, 93, 90.0, 93.0, 93.0, 93.0, 0.04046412349650491, 0.0318496909552568, 0.01438373139914823], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 588.4615384615383, 89, 1790, 455.0, 1476.3999999999996, 1790.0, 1790.0, 0.09191176470588235, 0.01721964702347285, 0.06255413072680996], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1076.6956521739132, 723, 1568, 1043.0, 1452.0000000000002, 1555.6, 1568.0, 0.09837257543679563, 0.050915493145997734, 0.04524754202219798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=277ccbe0-03c7-491d-a9e1-c8eb1c204666", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 259.0, 172, 510, 180.0, 510.0, 510.0, 510.0, 0.04128073479707939, 0.06397707629195801, 0.09284134007585336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5b6c739-9816-4d76-a775-acca981f996b", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=757ea1cf-96eb-422d-92e5-713afe00823f", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["addBook", 60, 6, 10.0, 936.1333333333331, 452, 2547, 730.0, 1585.6, 1764.8999999999999, 2547.0, 0.2900708739835433, 87.84604265522418, 1.0560392755963373], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/91b5fdc6-df88-4b39-be96-03aaf27ea151", 3, 0, 0.0, 308.3333333333333, 190, 442, 293.0, 442.0, 442.0, 442.0, 0.017421400448310705, 0.024016806933136667, 0.011171926719782581], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 138.42372881355936, 81, 366, 90.0, 348.0, 355.0, 366.0, 0.2618660843475096, 0.1946094630746629, 0.12658565600782934], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 532.4406779661017, 405, 841, 504.0, 681.0, 702.0, 841.0, 0.26176849017258974, 76.96862764264165, 0.1316511449598474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6eb09b0-e781-4f37-8266-4eec0819771a", 3, 0, 0.0, 347.66666666666663, 196, 636, 211.0, 636.0, 636.0, 636.0, 0.019302162485603805, 0.026609589233897172, 0.012378014354374835], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 141.93220338983053, 84, 392, 90.0, 266.0, 343.0, 392.0, 0.2622268840334939, 0.46401866588739354, 0.12752830883660154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/395f8f4a-d626-45ab-9fe0-6aede3745a90", 3, 0, 0.0, 991.3333333333333, 372, 1584, 1018.0, 1584.0, 1584.0, 1584.0, 0.026573835401663522, 0.026651688435066833, 0.01704116397828032], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 834.220338983051, 571, 1177, 838.0, 1021.0, 1071.0, 1177.0, 0.2615549664411679, 235.3476185683523, 0.13128833276441434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 101.17647058823529, 85, 249, 91.0, 134.5999999999999, 249.0, 249.0, 0.08870336551004436, 0.06626765099139055, 0.031531274458648575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 6, 3.35195530726257, 158.36312849162005, 84, 2027, 93.0, 271.0, 324.0, 1274.9999999999893, 0.7466982588164623, 1.5961441143282635, 0.3585044603749343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 96.16666666666666, 88, 137, 92.0, 127.40000000000003, 137.0, 137.0, 0.05733561401664644, 0.04440150577656311, 0.020381019044979787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 91.13333333333334, 86, 105, 90.0, 104.4, 105.0, 105.0, 0.0869499689878444, 0.07056193772353388, 0.03090799678864781], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da8d194d-9f40-43fd-8cb4-512ad87e6186", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 246.41666666666666, 170, 505, 177.5, 459.10000000000014, 505.0, 505.0, 0.056119347144928215, 0.08697402726464948, 0.12621372702614225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 336.70588235294116, 171, 1385, 184.0, 690.5999999999995, 1385.0, 1385.0, 0.11488660016759927, 8.252537853445245, 0.25665354974251886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea796e65-50fd-4587-817a-c784fd5b4825", 3, 0, 0.0, 709.0, 171, 1501, 455.0, 1501.0, 1501.0, 1501.0, 0.026558779004399905, 0.02663658792726436, 0.017031508671441344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f666e7a7-b8dd-4dc2-b6b0-792df1462f57", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 113.82352941176471, 87, 292, 91.0, 267.2, 292.0, 292.0, 0.08641285009912063, 0.0716450290372592, 0.030717067808671786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 91.41666666666666, 84, 119, 89.5, 111.80000000000003, 119.0, 119.0, 0.10035878264796648, 0.07791526582532554, 0.035674411019394336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/130050f9-9d0d-48f9-9d99-5a806e9e407f", 3, 0, 0.0, 289.6666666666667, 186, 494, 189.0, 494.0, 494.0, 494.0, 0.035586766467776185, 0.028925831988944377, 0.022820940736171576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 86.70588235294117, 82, 91, 86.0, 90.2, 91.0, 91.0, 0.08645591765328126, 0.06425093099037796, 0.043396818040807195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 136.11764705882356, 82, 258, 87.0, 255.6, 258.0, 258.0, 0.0863847475024645, 0.03837888540809171, 0.04841277554193725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 227.58823529411762, 82, 874, 89.0, 838.0, 874.0, 874.0, 0.08646075444637144, 9.173213870212235, 0.04995532331236236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 255.1176470588236, 83, 690, 252.0, 673.1999999999999, 690.0, 690.0, 0.08638562543192813, 3.008808157851945, 0.0499962762078743], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 41.1764705882353, 0.5147058823529411], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07352941176470588], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07352941176470588], "isController": false}, {"data": ["401/Unauthorized", 8, 47.05882352941177, 0.5882352941176471], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1360, 17, "401/Unauthorized", 8, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
