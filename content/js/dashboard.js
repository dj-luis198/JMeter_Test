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

    var data = {"OkPercent": 98.92307692307692, "KoPercent": 1.0769230769230769};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8232758620689655, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a1211cf-b93e-4b43-8a1f-dc637e3bcc6a"], "isController": false}, {"data": [0.40350877192982454, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0982df6-d0af-4bef-98ad-a3263c6a8cf1"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61c11764-e9b1-4a96-b664-458c005a2a66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a012155-6a6b-4094-badb-99e93d53cb30"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eba21b1c-cb7a-4ea4-9d3a-a351b7935416"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/642d1b20-9745-4527-9563-df791e444da1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5abbad20-3786-4d47-9a6e-9452ac4d35de"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d540d646-2247-4d22-a8a1-3e0576d1d46e"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80125fda-cd0a-4529-adfb-7940e5546484"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29a77cf9-eb84-4112-b0a1-7a1d47c91baa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08cc7f5f-362e-4c21-bec3-e4d8f6648cba"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2720d7b2-813c-40f7-9e6e-6bd2f098a40a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad9dce4e-990f-489b-84ec-93ab8e5ea198"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9ef633b-0d0d-43a4-ba40-b7d9cea18736"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eba21b1c-cb7a-4ea4-9d3a-a351b7935416"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35535b23-6e14-4c19-9aff-0b0fa07b4bbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0982df6-d0af-4bef-98ad-a3263c6a8cf1"], "isController": false}, {"data": [0.425, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3898305084745763, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61c11764-e9b1-4a96-b664-458c005a2a66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a1211cf-b93e-4b43-8a1f-dc637e3bcc6a"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9514285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a012155-6a6b-4094-badb-99e93d53cb30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80125fda-cd0a-4529-adfb-7940e5546484"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55ed4d27-61a3-4055-983f-cdcbf9625a6f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35535b23-6e14-4c19-9aff-0b0fa07b4bbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d540d646-2247-4d22-a8a1-3e0576d1d46e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad9dce4e-990f-489b-84ec-93ab8e5ea198"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c00fbb14-296e-42fa-8e3d-29ff9886a387"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2720d7b2-813c-40f7-9e6e-6bd2f098a40a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/29a77cf9-eb84-4112-b0a1-7a1d47c91baa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9ef633b-0d0d-43a4-ba40-b7d9cea18736"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 14, 1.0769230769230769, 298.742307692308, 77, 2186, 92.0, 811.4000000000005, 1041.7500000000002, 1424.92, 5.017929447911962, 714.4173918539705, 3.6625494615858196], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a1211cf-b93e-4b43-8a1f-dc637e3bcc6a", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1320.017543859649, 963, 1750, 1299.0, 1605.4, 1689.4999999999998, 1750.0, 0.25869815825065584, 311.3011099058702, 1.2720168230391133], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0982df6-d0af-4bef-98ad-a3263c6a8cf1", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 627.7692307692307, 103, 1255, 499.0, 1149.3999999999999, 1255.0, 1255.0, 0.06686554881185064, 0.01266788717724514, 0.04520155301666495], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 627.7692307692307, 103, 1255, 499.0, 1149.3999999999999, 1255.0, 1255.0, 0.06871471763536799, 0.013018217989513078, 0.04645160336543544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 106.57894736842104, 78, 247, 82.0, 245.0, 247.0, 247.0, 0.09817244247869918, 0.034029345809845145, 0.05555502629988064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 98.3157894736842, 79, 244, 82.0, 234.0, 244.0, 244.0, 0.09816939904827351, 0.07295596940989857, 0.04927643663165291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 139.8421052631579, 78, 716, 82.0, 243.0, 716.0, 716.0, 0.09817294973544972, 1.544336793283937, 0.05736678996414104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 155.05263157894737, 79, 769, 82.0, 319.0, 769.0, 769.0, 0.09817142798092374, 4.674268856987481, 0.0572700302006314], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 230.23076923076925, 81, 367, 226.0, 349.0, 367.0, 367.0, 0.06695853721349472, 0.1297271359129539, 0.043282618143188255], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61c11764-e9b1-4a96-b664-458c005a2a66", 1, 0, 0.0, 798.0, 798, 798, 798.0, 798.0, 798.0, 798.0, 1.2531328320802004, 0.22639606829573933, 0.8639763471177945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 105.64285714285714, 80, 244, 82.5, 244.0, 244.0, 244.0, 0.08493960187595179, 0.06312405959726494, 0.042635698597889855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 114.57142857142856, 78, 243, 81.0, 241.5, 243.0, 243.0, 0.08493908654079503, 0.03184030769184099, 0.04793228307164005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 579.3333333333334, 481, 699, 558.0, 699.0, 699.0, 699.0, 0.08240852653554553, 24.230843022058014, 0.046998612789803315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a012155-6a6b-4094-badb-99e93d53cb30", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 967.3333333333334, 920, 1015, 967.0, 1015.0, 1015.0, 1015.0, 0.0813868316106454, 73.23201414604867, 0.04633644807520144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 137.0, 82, 245, 84.0, 245.0, 245.0, 245.0, 0.0831232163143166, 0.14708912886869302, 0.04602623403341553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 113.33333333333331, 77, 245, 82.0, 245.0, 245.0, 245.0, 0.07034195569394684, 0.05227561355770854, 0.03530836447918816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 91.60000000000001, 78, 244, 81.0, 147.40000000000006, 244.0, 244.0, 0.07034393494592896, 0.018822498217953648, 0.040118025398850114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 145.53333333333333, 78, 247, 82.0, 245.2, 247.0, 247.0, 0.07029020482565686, 0.018945406769415325, 0.041322952446333425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 123.66666666666667, 79, 245, 82.0, 243.8, 245.0, 245.0, 0.07034393494592896, 0.018959888715894914, 0.04142323512929215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eba21b1c-cb7a-4ea4-9d3a-a351b7935416", 1, 0, 0.0, 675.0, 675, 675, 675.0, 675.0, 675.0, 675.0, 1.4814814814814814, 0.26765046296296297, 1.021412037037037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 134.66666666666666, 81, 242, 81.0, 242.0, 242.0, 242.0, 0.08350033400133601, 0.06205444743653975, 0.04688739458082833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 542.2105263157895, 80, 1179, 712.0, 1089.0, 1179.0, 1179.0, 0.09252811150124426, 43.8312645640465, 0.05021133846783187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 189.78571428571428, 79, 803, 84.0, 524.5, 803.0, 803.0, 0.08485979948841664, 5.4753098235067705, 0.049367377771581664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 372.05263157894734, 79, 726, 461.0, 712.0, 726.0, 726.0, 0.09259575131705272, 14.341414241713897, 0.05033846945314898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 149.21428571428572, 79, 641, 82.0, 479.0, 641.0, 641.0, 0.08486082824168363, 1.8035175381570652, 0.04945084815367084], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 510.91666666666663, 366, 798, 415.0, 788.1, 798.0, 798.0, 0.07422665107906994, 0.013410088329714784, 0.051175796544749394], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 260.93333333333334, 159, 490, 166.0, 489.4, 490.0, 490.0, 0.0702622185998145, 0.10889271574014221, 0.15802137640173128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/642d1b20-9745-4527-9563-df791e444da1", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5abbad20-3786-4d47-9a6e-9452ac4d35de", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d540d646-2247-4d22-a8a1-3e0576d1d46e", 3, 0, 0.0, 484.3333333333333, 177, 899, 377.0, 899.0, 899.0, 899.0, 0.019940179461615155, 0.027489147141907613, 0.012787159355267532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 662.6, 120, 1780, 535.5, 1687.4, 1775.55, 1780.0, 0.09799982360031752, 0.060197157270116916, 0.04431046711615919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 91.21052631578947, 78, 245, 83.0, 88.0, 245.0, 245.0, 0.09259575131705272, 0.06881383471902063, 0.04647872673531748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 114.42105263157896, 79, 246, 81.0, 244.0, 246.0, 246.0, 0.09252315513698296, 0.09789687868266506, 0.04867737541026715], "isController": false}, {"data": ["login", 20, 0, 0.0, 2428.4500000000003, 1167, 3921, 2173.5, 3780.5000000000005, 3914.6, 3921.0, 0.09898050084133425, 17.901160043737008, 0.17396016344155202], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 85.0, 82, 92, 85.0, 89.5, 92.0, 92.0, 0.08495145631067962, 0.06877417703276699, 0.03019758798543689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80125fda-cd0a-4529-adfb-7940e5546484", 3, 0, 0.0, 280.3333333333333, 226, 344, 271.0, 344.0, 344.0, 344.0, 0.03465003465003465, 0.028886308183183183, 0.022220237063987066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29a77cf9-eb84-4112-b0a1-7a1d47c91baa", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08cc7f5f-362e-4c21-bec3-e4d8f6648cba", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.9948160046728972, 1.8588152258566977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 635.1052631578947, 163, 1263, 798.0, 1170.0, 1263.0, 1263.0, 0.0924857742276221, 58.30217927971835, 0.19554827787837634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 279.7894736842106, 162, 1004, 168.0, 479.0, 1004.0, 1004.0, 0.09812833119861174, 6.322791289432096, 0.21937149288053134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 847.25, 81, 1163, 1072.5, 1163.0, 1163.0, 1163.0, 0.044767266174972856, 40.17090515914763, 0.08293310931047218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2720d7b2-813c-40f7-9e6e-6bd2f098a40a", 3, 0, 0.0, 356.33333333333337, 167, 697, 205.0, 697.0, 697.0, 697.0, 0.016140399959110988, 0.022250844344672862, 0.010350451796695522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad9dce4e-990f-489b-84ec-93ab8e5ea198", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9ef633b-0d0d-43a4-ba40-b7d9cea18736", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1049.590909090909, 540, 1988, 938.0, 1659.8, 1947.4999999999995, 1988.0, 0.09232409113227105, 0.02934306163472393, 0.0416540333038176], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/eba21b1c-cb7a-4ea4-9d3a-a351b7935416", 3, 0, 0.0, 363.0, 192, 575, 322.0, 575.0, 575.0, 575.0, 0.025302790054316654, 0.025376919322053913, 0.01622607304915489], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 107.53333333333335, 83, 239, 87.0, 236.6, 239.0, 239.0, 0.06953748302126457, 0.053986620119048166, 0.024718402167715137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 325.2857142857143, 163, 1048, 321.5, 766.5, 1048.0, 1048.0, 0.08481815593212125, 7.370062324305248, 0.18920791201933854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 394.235294117647, 162, 1009, 170.0, 976.1999999999999, 1009.0, 1009.0, 0.11677348005577651, 33.009376813852775, 0.2555962724359635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 98.33333333333333, 79, 231, 81.0, 231.0, 231.0, 231.0, 0.056584556188464294, 0.04205160865177864, 0.028402794805537743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 98.22222222222223, 79, 233, 81.0, 233.0, 233.0, 233.0, 0.05653017769319188, 0.024560203068960538, 0.03171235011651498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 189.33333333333334, 78, 882, 83.0, 882.0, 882.0, 882.0, 0.056525917133005484, 5.664889289673344, 0.032691312751618844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 169.55555555555554, 78, 645, 81.0, 645.0, 645.0, 645.0, 0.0565852677111888, 1.8622177220343032, 0.032780896735030055], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 918.2105263157894, 626, 1417, 864.0, 1266.6, 1322.1999999999998, 1417.0, 0.2470409264468147, 295.5468333524754, 0.48780932937056576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1049.590909090909, 540, 1988, 938.0, 1659.8, 1947.4999999999995, 1988.0, 0.0869558343412305, 0.027636886269673755, 0.03923202682192235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 80.375, 78, 82, 81.0, 82.0, 82.0, 82.0, 0.037986163539930576, 0.010238458141621914, 0.022368805287673963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 83.125, 80, 91, 82.0, 91.0, 91.0, 91.0, 0.037985983172209456, 0.01023840952688458, 0.022331603388349698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 102.93333333333332, 77, 246, 81.0, 239.4, 246.0, 246.0, 0.0693298575964725, 0.018686563180299227, 0.04075837331355121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 108.19999999999999, 77, 328, 81.0, 269.8, 328.0, 328.0, 0.06933017803989722, 0.018686649549816043, 0.04082626695122853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 83.73333333333333, 79, 98, 83.0, 92.60000000000001, 98.0, 98.0, 0.06932729415570911, 0.05152155356688928, 0.03479905194925242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 82.25, 80, 91, 81.0, 91.0, 91.0, 91.0, 0.037986163539930576, 0.010164266415957987, 0.02166398389386666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35535b23-6e14-4c19-9aff-0b0fa07b4bbf", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 92.93333333333332, 77, 245, 82.0, 157.40000000000003, 245.0, 245.0, 0.0693298575964725, 0.018551153302181118, 0.03953968441048822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 82.5, 80, 86, 82.5, 86.0, 86.0, 86.0, 0.03798490100185176, 0.028229013342196477, 0.01906663976069512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 86.875, 81, 97, 84.5, 97.0, 97.0, 97.0, 0.037627581016885375, 0.029617021776962512, 0.013375429189595974], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 498.0, 343, 697, 476.0, 686.8000000000001, 697.0, 697.0, 0.07246420570172525, 0.013091677787909348, 0.04932378063877198], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f0982df6-d0af-4bef-98ad-a3263c6a8cf1", 3, 0, 0.0, 345.66666666666663, 186, 663, 188.0, 663.0, 663.0, 663.0, 0.029336123524637454, 0.024456319123241053, 0.018812553171723888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1245.25, 781, 2186, 1169.5, 1594.4, 2156.5499999999997, 2186.0, 0.0984377922371957, 0.050949247935267304, 0.045277539202850756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 166.625, 163, 179, 165.0, 179.0, 179.0, 179.0, 0.03797011751751372, 0.05884626611356862, 0.08539568422151766], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 879.5593220338982, 414, 1625, 729.0, 1454.0, 1602.0, 1625.0, 0.2641522949909561, 92.07866921948593, 0.9582385085357009], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 154.0, 79, 388, 84.0, 330.6, 337.29999999999995, 388.0, 0.24781638979344284, 0.18416823499297855, 0.11979405561304124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61c11764-e9b1-4a96-b664-458c005a2a66", 3, 0, 0.0, 274.3333333333333, 161, 413, 249.0, 413.0, 413.0, 413.0, 0.030220914887830037, 0.025193933277256747, 0.01937994867481288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a1211cf-b93e-4b43-8a1f-dc637e3bcc6a", 3, 0, 0.0, 274.6666666666667, 171, 367, 286.0, 367.0, 367.0, 367.0, 0.03609673926122007, 0.029551855221994945, 0.023147974070508965], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 541.7192982456139, 388, 738, 486.0, 651.6, 705.1, 738.0, 0.24759248882576002, 72.80041255912899, 0.12452161303248674], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 114.87719298245612, 78, 324, 84.0, 239.2, 248.2, 324.0, 0.24796947800249708, 0.43878974037160623, 0.12059453129418317], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 761.1754385964911, 545, 1143, 727.0, 958.4, 1043.3999999999996, 1143.0, 0.247442013917528, 222.6487590796568, 0.12420429214219668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 84.70588235294117, 81, 91, 84.0, 88.6, 91.0, 91.0, 0.11391353292771181, 0.08510141864228471, 0.04049270115789756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 8, 4.571428571428571, 135.39428571428567, 79, 524, 87.0, 266.0, 338.79999999999995, 451.80000000000086, 0.7146503318019398, 1.5592936447166923, 0.34292049515058703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 104.11111111111111, 82, 246, 86.0, 246.0, 246.0, 246.0, 0.05447809980387884, 0.042188606586402264, 0.019365262039660054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a012155-6a6b-4094-badb-99e93d53cb30", 3, 0, 0.0, 297.6666666666667, 168, 388, 337.0, 388.0, 388.0, 388.0, 0.04646480291179431, 0.02987239119491985, 0.029796764888097266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 103.57894736842105, 81, 248, 84.0, 245.0, 248.0, 248.0, 0.09973596216332552, 0.08093807085715186, 0.03545301780024462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 315.0, 162, 963, 165.0, 963.0, 963.0, 963.0, 0.05649717514124294, 7.587859973320778, 0.12545732305398619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80125fda-cd0a-4529-adfb-7940e5546484", 1, 0, 0.0, 765.0, 765, 765, 765.0, 765.0, 765.0, 765.0, 1.3071895424836601, 0.23616217320261437, 0.9012459150326797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55ed4d27-61a3-4055-983f-cdcbf9625a6f", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35535b23-6e14-4c19-9aff-0b0fa07b4bbf", 3, 0, 0.0, 446.0, 367, 539, 432.0, 539.0, 539.0, 539.0, 0.06393998167053859, 0.028931176602229377, 0.04100317834992221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 215.46666666666667, 162, 409, 166.0, 361.6, 409.0, 409.0, 0.06930070963926671, 0.10740256464601197, 0.15585892021409298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d540d646-2247-4d22-a8a1-3e0576d1d46e", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad9dce4e-990f-489b-84ec-93ab8e5ea198", 3, 0, 0.0, 355.66666666666663, 196, 641, 230.0, 641.0, 641.0, 641.0, 0.03588602598148281, 0.023071256937965023, 0.023012848692552455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 98.06666666666665, 82, 244, 86.0, 155.80000000000007, 244.0, 244.0, 0.0729125147040238, 0.060451879866910356, 0.02591812046119596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 96.63157894736842, 80, 246, 87.0, 102.0, 246.0, 246.0, 0.09192243681541976, 0.07136556373853388, 0.03267555371173124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c00fbb14-296e-42fa-8e3d-29ff9886a387", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.4958632569875776, 0.9265212538819876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2720d7b2-813c-40f7-9e6e-6bd2f098a40a", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29a77cf9-eb84-4112-b0a1-7a1d47c91baa", 3, 0, 0.0, 972.3333333333334, 184, 2104, 629.0, 2104.0, 2104.0, 2104.0, 0.025192724341210258, 0.02100213770763004, 0.016155490544330797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9ef633b-0d0d-43a4-ba40-b7d9cea18736", 3, 0, 0.0, 296.3333333333333, 236, 343, 310.0, 343.0, 343.0, 343.0, 0.05070736778053851, 0.033194178582898096, 0.03251742009363961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 83.82352941176471, 79, 102, 83.0, 91.6, 102.0, 102.0, 0.11684009402191095, 0.08683135893620532, 0.058648250319592025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 136.58823529411768, 78, 247, 81.0, 243.8, 247.0, 247.0, 0.1168376849643645, 0.07255373244857423, 0.06432515927725582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 308.6470588235294, 79, 929, 83.0, 891.4, 929.0, 929.0, 0.11684089706316969, 24.761410458634884, 0.06632707633147075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 183.05882352941174, 79, 636, 81.0, 517.5999999999999, 636.0, 636.0, 0.11684009402191095, 8.10758030179109, 0.06644072212332816], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 28.571428571428573, 0.3076923076923077], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.07692307692307693], "isController": false}, {"data": ["401/Unauthorized", 9, 64.28571428571429, 0.6923076923076923], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 14, "401/Unauthorized", 9, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
