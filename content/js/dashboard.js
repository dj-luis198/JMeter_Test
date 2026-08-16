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

    var data = {"OkPercent": 98.84437596302003, "KoPercent": 1.1556240369799693};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8119235836627141, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.33636363636363636, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da2affc9-cc70-498d-b377-f4182ac14f41"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.65625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af6318a5-9ec0-4c03-b647-7f8d78535726"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a41fe11b-5327-4bbc-b5c2-95ade2f52d38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c60e217-485b-4699-ba5c-70f73f9d358d"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=130251f3-f7fc-4a7b-b1d9-5ece271efe98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38bd2cae-8371-4192-aa24-5da83a90e76d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78c976bf-0e0c-44ee-ace5-463cb5c8e2a0"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c685ea07-756f-4f68-8658-230205c8b463"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b352b239-3875-4685-8fd5-cb452c853d48"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/130251f3-f7fc-4a7b-b1d9-5ece271efe98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d39bcb6-1985-4486-90a9-b15119f92a92"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2c60e217-485b-4699-ba5c-70f73f9d358d"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e936e17c-7f37-4b70-9a58-575d9e2fa737"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af8a2485-dcfc-4b73-accf-f59db0e7f76f"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/954712eb-6339-4b2f-8d14-5acd7399d8ab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34ffc86f-a2a4-4006-aa2b-d9d49c31af12"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88675658-11da-49a0-bfb9-32ac96249565"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.18421052631578946, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da2affc9-cc70-498d-b377-f4182ac14f41"], "isController": false}, {"data": [0.36065573770491804, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7818181818181819, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9576271186440678, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38bd2cae-8371-4192-aa24-5da83a90e76d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a9ade2c-b9d8-4dbf-b95f-1f8a60f3e0a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b352b239-3875-4685-8fd5-cb452c853d48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d39bcb6-1985-4486-90a9-b15119f92a92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c59bd041-6f25-4666-a315-f63254fe82bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c685ea07-756f-4f68-8658-230205c8b463"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34ffc86f-a2a4-4006-aa2b-d9d49c31af12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/af6318a5-9ec0-4c03-b647-7f8d78535726"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88675658-11da-49a0-bfb9-32ac96249565"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=954712eb-6339-4b2f-8d14-5acd7399d8ab"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/78c976bf-0e0c-44ee-ace5-463cb5c8e2a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e936e17c-7f37-4b70-9a58-575d9e2fa737"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af8a2485-dcfc-4b73-accf-f59db0e7f76f"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 15, 1.1556240369799693, 319.77426810477715, 81, 3207, 99.5, 884.4000000000005, 1074.1999999999998, 1735.02, 5.067679682040191, 685.2324173988709, 3.695128452551995], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1411.072727272727, 1016, 1779, 1418.0, 1721.4, 1767.3999999999999, 1779.0, 0.24988527993966406, 300.6959597880632, 1.2286839692345786], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da2affc9-cc70-498d-b377-f4182ac14f41", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 481.375, 87, 989, 469.5, 827.3000000000002, 989.0, 989.0, 0.09415918787700457, 0.018355984257760777, 0.06343561497719581], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 481.375, 87, 989, 469.5, 827.3000000000002, 989.0, 989.0, 0.09633795354102191, 0.018780726538697754, 0.06490346259678954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af6318a5-9ec0-4c03-b647-7f8d78535726", 1, 0, 0.0, 818.0, 818, 818, 818.0, 818.0, 818.0, 818.0, 1.2224938875305624, 0.2208607121026895, 0.8428522310513448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a41fe11b-5327-4bbc-b5c2-95ade2f52d38", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 119.94444444444444, 82, 251, 84.0, 248.3, 251.0, 251.0, 0.1588870842454629, 0.08228820020655321, 0.08839128482275263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 115.22222222222223, 82, 250, 86.0, 246.4, 250.0, 250.0, 0.1588870842454629, 0.11807917100663795, 0.07975386845914836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 219.8888888888889, 83, 658, 85.5, 649.9, 658.0, 658.0, 0.15865880424147868, 7.810795657376313, 0.09115650699420896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c60e217-485b-4699-ba5c-70f73f9d358d", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.3001064161129568, 1.1452709717607974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 236.44444444444443, 81, 908, 84.0, 886.4000000000001, 908.0, 908.0, 0.15865880424147868, 23.82921474634424, 0.09100156675569189], "isController": false}, {"data": ["goToProfile", 17, 2, 11.764705882352942, 211.70588235294122, 83, 439, 194.0, 383.79999999999995, 439.0, 439.0, 0.09975998920244823, 0.20592689866732392, 0.0644818128737332], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=130251f3-f7fc-4a7b-b1d9-5ece271efe98", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 105.43749999999999, 82, 251, 85.0, 248.9, 251.0, 251.0, 0.09203389148053771, 0.06839628068036055, 0.04619669943456678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 135.3125, 83, 252, 85.0, 249.9, 252.0, 252.0, 0.09195138070745093, 0.024604178040860895, 0.052441021809718116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 568.0, 488, 648, 568.0, 648.0, 648.0, 648.0, 0.3014772384684956, 88.64431809617123, 0.1719362375640639], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 861.5, 822, 901, 861.5, 901.0, 901.0, 901.0, 0.2838087129274869, 255.3715787746559, 0.1615824996452391], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 170.5, 83, 258, 170.5, 258.0, 258.0, 258.0, 0.321078824851501, 0.5681590142880077, 0.17778485711992295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38bd2cae-8371-4192-aa24-5da83a90e76d", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.5458128776435045, 2.082939954682779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 97.14285714285715, 83, 251, 85.0, 172.0, 251.0, 251.0, 0.06766390372393126, 0.05028538157608564, 0.03396410792392644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 131.35714285714283, 82, 250, 85.0, 249.5, 250.0, 250.0, 0.0676122725933653, 0.018091565127521577, 0.03856012421340365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 99.85714285714285, 81, 247, 84.0, 197.5, 247.0, 247.0, 0.0676455950638043, 0.018232601794541, 0.039768211160556816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 131.14285714285714, 82, 251, 85.0, 250.0, 251.0, 251.0, 0.0676132521974307, 0.01822388438133874, 0.03981522565922921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 84.5, 83, 86, 84.5, 86.0, 86.0, 86.0, 0.3209757663296421, 0.23853765446958755, 0.1802354156636174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 585.2777777777779, 82, 1156, 856.0, 1078.6000000000001, 1156.0, 1156.0, 0.10212997741792722, 51.06597499021254, 0.05516525906970938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 114.9375, 82, 249, 84.0, 245.5, 249.0, 249.0, 0.09195138070745093, 0.024783770581305136, 0.05405735467371627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 410.05555555555554, 83, 747, 490.5, 737.1, 747.0, 747.0, 0.10212823902546965, 16.695063695396854, 0.055264054689672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 94.375, 81, 246, 84.0, 139.6000000000001, 246.0, 246.0, 0.09203759735852095, 0.024807008663038848, 0.05419792110076966], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 601.8125000000001, 84, 1319, 536.5, 1194.4, 1319.0, 1319.0, 0.09592441156368782, 0.0187001080648449, 0.06528059014496576], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 241.57142857142858, 168, 502, 174.5, 418.5, 502.0, 502.0, 0.0675822451787309, 0.10473928036977143, 0.15199405336583718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 560.0526315789473, 139, 1218, 473.0, 1190.0, 1218.0, 1218.0, 0.0857598093424028, 0.05267863288708141, 0.03877616379446533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 98.38888888888889, 82, 252, 85.0, 163.80000000000013, 252.0, 252.0, 0.10212881848304661, 0.07589846764218601, 0.05126387959012301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 120.1111111111111, 83, 340, 84.5, 259.90000000000015, 340.0, 340.0, 0.10213055689523107, 0.11254751907855541, 0.05348112712417374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78c976bf-0e0c-44ee-ace5-463cb5c8e2a0", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["login", 19, 0, 0.0, 2875.947368421053, 1849, 5757, 2906.0, 4576.0, 5757.0, 5757.0, 0.08381120423467137, 10.673263812307015, 0.1410824809770622], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c685ea07-756f-4f68-8658-230205c8b463", 3, 0, 0.0, 316.3333333333333, 179, 570, 200.0, 570.0, 570.0, 570.0, 0.04100489325059457, 0.026362195367813892, 0.0262954556327055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 101.0625, 85, 253, 86.5, 171.10000000000008, 253.0, 253.0, 0.09022878636643038, 0.07304654677516678, 0.03207351390369205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b352b239-3875-4685-8fd5-cb452c853d48", 3, 0, 0.0, 307.6666666666667, 183, 440, 300.0, 440.0, 440.0, 440.0, 0.015216917154030708, 0.02097774874587241, 0.00975824439890641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/130251f3-f7fc-4a7b-b1d9-5ece271efe98", 3, 0, 0.0, 449.0, 174, 715, 458.0, 715.0, 715.0, 715.0, 0.023352664149768422, 0.023421080158019695, 0.014975504028334566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d39bcb6-1985-4486-90a9-b15119f92a92", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c60e217-485b-4699-ba5c-70f73f9d358d", 3, 0, 0.0, 1095.6666666666667, 222, 2072, 993.0, 2072.0, 2072.0, 2072.0, 0.0228679452388938, 0.027029137097143035, 0.014664665403847914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 685.3888888888889, 169, 1243, 942.0, 1226.8, 1243.0, 1243.0, 0.10207785137464839, 67.91508824063152, 0.21506571616119224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 394.94444444444446, 170, 1154, 332.0, 986.6000000000003, 1154.0, 1154.0, 0.1585400225479143, 31.816252457920836, 0.34979956797843853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 4, 66.66666666666667, 399.33333333333337, 83, 985, 168.5, 985.0, 985.0, 985.0, 0.09688670714377988, 38.65401151337037, 0.1156206602829092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e936e17c-7f37-4b70-9a58-575d9e2fa737", 2, 0, 0.0, 453.0, 439, 467, 453.0, 467.0, 467.0, 467.0, 0.015636972056730935, 0.026448472267830057, 0.009719660853622305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af8a2485-dcfc-4b73-accf-f59db0e7f76f", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/954712eb-6339-4b2f-8d14-5acd7399d8ab", 2, 0, 0.0, 449.5, 297, 602, 449.5, 602.0, 602.0, 602.0, 0.02617972380391387, 0.029784549054257477, 0.01627284589960076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34ffc86f-a2a4-4006-aa2b-d9d49c31af12", 1, 0, 0.0, 839.0, 839, 839, 839.0, 839.0, 839.0, 839.0, 1.1918951132300357, 0.21533261323003577, 0.8217558104886771], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1158.772727272727, 222, 2141, 1176.0, 1803.3, 2097.4999999999995, 2141.0, 0.08902557461961799, 0.028294705001618646, 0.040165835424085465], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 89.15384615384613, 85, 96, 87.0, 95.6, 96.0, 96.0, 0.06611200390569377, 0.05132719053225249, 0.023500751388352083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 262.6875, 170, 498, 173.0, 494.5, 498.0, 498.0, 0.0919043734993739, 0.14243382885108047, 0.2066950900088458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 369.0625000000001, 168, 1059, 331.0, 1019.1, 1059.0, 1059.0, 0.11399583915187095, 17.201919249088036, 0.25273345101028816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 16, 0, 0.0, 107.9375, 83, 248, 86.0, 247.3, 248.0, 248.0, 0.07789299449880725, 0.05788727423202376, 0.039098632004284116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88675658-11da-49a0-bfb9-32ac96249565", 3, 0, 0.0, 286.0, 194, 404, 260.0, 404.0, 404.0, 404.0, 0.01650682557237418, 0.022755991633790572, 0.010585431763534221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 16, 0, 0.0, 114.75, 82, 252, 84.0, 249.9, 252.0, 252.0, 0.07789261529324136, 0.020842359951511846, 0.04442313215942671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 16, 0, 0.0, 115.31249999999999, 83, 250, 84.5, 250.0, 250.0, 250.0, 0.0778941321376584, 0.02099490280272824, 0.04579323002624058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 16, 0, 0.0, 94.56250000000001, 82, 249, 84.0, 137.7000000000001, 249.0, 249.0, 0.0778922360913676, 0.020994391759001422, 0.045868181995209624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 85.0, 84, 86, 85.0, 86.0, 86.0, 86.0, 0.16241676140977748, 0.04790025580639922, 0.10040020505116128], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 970.7818181818182, 659, 1417, 903.0, 1348.6, 1411.3999999999999, 1417.0, 0.24057913960151348, 287.8162898049122, 0.47504982448658223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1158.772727272727, 222, 2141, 1176.0, 1803.3, 2097.4999999999995, 2141.0, 0.0868933265925177, 0.027617019637891812, 0.039203825083733566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 84.8, 82, 88, 85.0, 88.0, 88.0, 88.0, 0.03869160469561315, 0.01042859657811448, 0.022784216436967507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 85.2, 83, 89, 84.0, 89.0, 89.0, 89.0, 0.03869130528987526, 0.010428515878911691, 0.022746255648930572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 189.23076923076923, 81, 970, 84.0, 681.9999999999998, 970.0, 970.0, 0.06657653228449688, 4.624693403866048, 0.038699609887127166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 170.46153846153848, 82, 487, 85.0, 391.3999999999999, 487.0, 487.0, 0.06652066234111795, 1.5211104761088483, 0.03873209538807131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 110.38461538461539, 81, 256, 84.0, 254.4, 256.0, 256.0, 0.06657516848638793, 0.04947627267396604, 0.03341761386914394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 85.0, 83, 88, 84.0, 88.0, 88.0, 88.0, 0.03869160469561315, 0.010353027037693361, 0.02206630580296687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 125.15384615384616, 82, 247, 83.0, 246.6, 247.0, 247.0, 0.06652168351029807, 0.025485320455417678, 0.03750839516438531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 86.2, 84, 91, 85.0, 91.0, 91.0, 91.0, 0.03869250294063022, 0.028754877673651955, 0.01942182276512103], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 542.9285714285714, 83, 2072, 439.0, 1393.5, 2072.0, 2072.0, 0.08787456533473932, 0.0169668524586048, 0.059800799344706806], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 90.4, 85, 98, 89.0, 98.0, 98.0, 98.0, 0.03910007272613527, 0.030776033805922882, 0.013898853976868398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1645.7368421052631, 1129, 3207, 1538.0, 2225.0, 3207.0, 3207.0, 0.08322893212899608, 0.04307747463707805, 0.03828205764917691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 172.4, 167, 181, 171.0, 181.0, 181.0, 181.0, 0.03866557371978285, 0.059924087395796286, 0.08695978152017571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da2affc9-cc70-498d-b377-f4182ac14f41", 3, 0, 0.0, 321.3333333333333, 199, 440, 325.0, 440.0, 440.0, 440.0, 0.046401559092385504, 0.029831731512845495, 0.0297562081419269], "isController": false}, {"data": ["addBook", 61, 3, 4.918032786885246, 1007.4754098360656, 460, 3390, 775.0, 1700.0000000000002, 2002.8999999999999, 3390.0, 0.2945479654461436, 93.5220676708861, 1.0720133183363352], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 159.29090909090905, 82, 424, 87.0, 337.6, 345.0, 424.0, 0.24163715764408167, 0.17957605172572863, 0.11680702444709025], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 533.5636363636365, 407, 750, 493.0, 662.2, 739.4, 750.0, 0.24134027223182708, 70.96205328738361, 0.12137718769471771], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 113.47272727272728, 82, 251, 86.0, 248.4, 249.39999999999998, 251.0, 0.24195818962483284, 0.42815257773456744, 0.1176710726886394], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 809.9636363636365, 573, 1332, 816.0, 998.2, 1029.9999999999998, 1332.0, 0.2409849713008807, 216.83870078292733, 0.12096315942251239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 96.68750000000001, 84, 250, 86.5, 139.40000000000012, 250.0, 250.0, 0.11195700850873265, 0.08363975733318406, 0.03979721786833856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 3, 1.694915254237288, 185.1242937853107, 83, 3042, 93.0, 320.40000000000003, 417.29999999999984, 2022.5399999999986, 0.7369503578580975, 1.5173782171318058, 0.35729373977325246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 16, 0, 0.0, 91.87499999999999, 85, 122, 90.5, 103.80000000000001, 122.0, 122.0, 0.08292690511607176, 0.06421976148148915, 0.02947792330297863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38bd2cae-8371-4192-aa24-5da83a90e76d", 3, 0, 0.0, 282.0, 198, 438, 210.0, 438.0, 438.0, 438.0, 0.0716674629718108, 0.03242766065456283, 0.04595862697085523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a9ade2c-b9d8-4dbf-b95f-1f8a60f3e0a3", 2, 0, 0.0, 250.5, 202, 299, 250.5, 299.0, 299.0, 299.0, 0.02100024150277728, 0.029900734483446562, 0.013053372770036856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 87.61111111111113, 85, 97, 86.5, 93.4, 97.0, 97.0, 0.14859576997374807, 0.12058895004705533, 0.05282115260785576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b352b239-3875-4685-8fd5-cb452c853d48", 1, 0, 0.0, 729.0, 729, 729, 729.0, 729.0, 729.0, 729.0, 1.371742112482853, 0.24782450274348422, 0.9457518861454047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d39bcb6-1985-4486-90a9-b15119f92a92", 3, 0, 0.0, 264.3333333333333, 175, 378, 240.0, 378.0, 378.0, 378.0, 0.026800789729937376, 0.026879307668599303, 0.017186704351554893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c59bd041-6f25-4666-a315-f63254fe82bb", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 16, 0, 0.0, 235.25, 168, 499, 173.5, 497.6, 499.0, 499.0, 0.0778588807785888, 0.12066605839416059, 0.17510644768856448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 344.3846153846154, 165, 1227, 330.0, 935.3999999999997, 1227.0, 1227.0, 0.0664910620668491, 6.214077244712683, 0.14823131377387924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 91.85714285714288, 86, 103, 91.0, 102.0, 103.0, 103.0, 0.06731643049818967, 0.0558121577079717, 0.023928887403653357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c685ea07-756f-4f68-8658-230205c8b463", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34ffc86f-a2a4-4006-aa2b-d9d49c31af12", 3, 0, 0.0, 329.0, 189, 473, 325.0, 473.0, 473.0, 473.0, 0.03791612952149845, 0.03160911709132732, 0.024314705454867167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 97.66666666666666, 84, 250, 87.5, 110.50000000000023, 250.0, 250.0, 0.09845534503128693, 0.07643749931628233, 0.03499779842909027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af6318a5-9ec0-4c03-b647-7f8d78535726", 3, 0, 0.0, 1113.0, 370, 2465, 504.0, 2465.0, 2465.0, 2465.0, 0.034233679093492175, 0.02853920968699006, 0.021953238220761586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88675658-11da-49a0-bfb9-32ac96249565", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.24381115047233468, 0.9304360661268556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=954712eb-6339-4b2f-8d14-5acd7399d8ab", 1, 0, 0.0, 1141.0, 1141, 1141, 1141.0, 1141.0, 1141.0, 1141.0, 0.8764241893076249, 0.15833835451358458, 0.6042533961437335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78c976bf-0e0c-44ee-ace5-463cb5c8e2a0", 3, 0, 0.0, 1237.0, 225, 3059, 427.0, 3059.0, 3059.0, 3059.0, 0.049747943751658266, 0.03198313441065269, 0.0319021644501194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 95.75000000000001, 83, 252, 85.0, 142.1000000000001, 252.0, 252.0, 0.11406491719599918, 0.08476894725210486, 0.057255241639398026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e936e17c-7f37-4b70-9a58-575d9e2fa737", 1, 0, 0.0, 1319.0, 1319, 1319, 1319.0, 1319.0, 1319.0, 1319.0, 0.7581501137225171, 0.13697047952994693, 0.5227089651250948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 155.0, 81, 248, 86.0, 248.0, 248.0, 248.0, 0.11406491719599918, 0.051936296526010374, 0.06385518924082668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 231.5, 81, 973, 84.0, 926.8000000000001, 973.0, 973.0, 0.11406491719599918, 12.856377676961026, 0.06583238873323781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 191.1875, 82, 746, 85.0, 567.5000000000002, 746.0, 746.0, 0.11406491719599918, 4.219260173164803, 0.06594378025393703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af8a2485-dcfc-4b73-accf-f59db0e7f76f", 3, 0, 0.0, 261.0, 185, 405, 193.0, 405.0, 405.0, 405.0, 0.026115115428810197, 0.026361644838782686, 0.016746997849855495], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 26.666666666666668, 0.3081664098613251], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 13.333333333333334, 0.15408320493066255], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 13.333333333333334, 0.15408320493066255], "isController": false}, {"data": ["401/Unauthorized", 7, 46.666666666666664, 0.539291217257319], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 15, "401/Unauthorized", 7, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
