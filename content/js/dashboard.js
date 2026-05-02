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

    var data = {"OkPercent": 96.89922480620154, "KoPercent": 3.10077519379845};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.718501326259947, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24cd4c3e-3c19-43ff-931f-d48b8c2f17e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=982e0053-1598-44cc-a5e7-05f50c87d49b"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bfce2d27-288a-47c1-9dc3-a3129c5e957b"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.92, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.94, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aee43fdd-5093-4a04-bd9e-530bd0854e52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a877285-079a-40ea-a09a-a86f43f4584f"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5e6a88ac-1d46-42dd-a3d9-c9b5ad00a0ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5fc18cb-bed4-40d0-98de-38f68253ff1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec8088e3-e179-4e3a-9782-328ae3d4e47f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3f48b38-8d08-427b-9915-ff16f515fc58"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1b3f3ac8-6918-4835-a1bb-d444435affb5"], "isController": false}, {"data": [0.4473684210526316, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c423025a-da1b-4430-b1ad-55059251b720"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.15384615384615385, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.18, 500, 1500, "register"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7c479232-6a98-45b1-9ffc-eb22b1f71673"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8255c811-226d-4fe8-b8e1-f460c83561df"], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3f48b38-8d08-427b-9915-ff16f515fc58"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e6a88ac-1d46-42dd-a3d9-c9b5ad00a0ef"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/982e0053-1598-44cc-a5e7-05f50c87d49b"], "isController": false}, {"data": [0.16037735849056603, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24cd4c3e-3c19-43ff-931f-d48b8c2f17e9"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4649122807017544, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8650306748466258, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/aee43fdd-5093-4a04-bd9e-530bd0854e52"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7a877285-079a-40ea-a09a-a86f43f4584f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c5fc18cb-bed4-40d0-98de-38f68253ff1a"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ce4d8da-e1ae-469b-99b4-985721c4645e"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec8088e3-e179-4e3a-9782-328ae3d4e47f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8255c811-226d-4fe8-b8e1-f460c83561df"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c423025a-da1b-4430-b1ad-55059251b720"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bfce2d27-288a-47c1-9dc3-a3129c5e957b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee0d71e7-5884-4b28-80ed-8baa55b5de75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b3f3ac8-6918-4835-a1bb-d444435affb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e4c004e-a8c7-4b4d-b59b-28832decf10c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1290, 40, 3.10077519379845, 469.11240310077494, 126, 3020, 152.0, 1320.0, 1543.900000000002, 2033.0699999999981, 5.1535477582067255, 758.4639968259739, 3.7616497894635916], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2193.0877192982452, 1599, 2882, 2193.0, 2611.4, 2792.3999999999996, 2882.0, 0.245048515306934, 294.87635663372123, 1.2049016353226687], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/24cd4c3e-3c19-43ff-931f-d48b8c2f17e9", 3, 0, 0.0, 311.6666666666667, 226, 449, 260.0, 449.0, 449.0, 449.0, 0.029344158067198124, 0.024176453147160954, 0.018817705531373796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=982e0053-1598-44cc-a5e7-05f50c87d49b", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 0.7002483042635659, 2.672298934108527], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 539.2666666666667, 138, 989, 505.0, 935.0, 989.0, 989.0, 0.08458996424664178, 0.017215379442382956, 0.05668518893168515], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 539.2666666666667, 138, 989, 505.0, 935.0, 989.0, 989.0, 0.08336297350168949, 0.016965667654054776, 0.055862961344589186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 207.3846153846154, 127, 536, 134.0, 473.5999999999999, 536.0, 536.0, 0.06314327208435941, 0.038781504849889015, 0.03478761699719741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 134.30769230769232, 128, 139, 135.0, 138.6, 139.0, 139.0, 0.06314204531656022, 0.04692489891201399, 0.031694346965539015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 343.15384615384613, 126, 1146, 134.0, 1110.8, 1146.0, 1146.0, 0.06314296538794066, 4.297582702106061, 0.03593058614886197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 432.99999999999994, 128, 1388, 135.0, 1385.2, 1388.0, 1388.0, 0.06314296538794066, 13.124511059429674, 0.035868923096725305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfce2d27-288a-47c1-9dc3-a3129c5e957b", 3, 0, 0.0, 381.6666666666667, 226, 461, 458.0, 461.0, 461.0, 461.0, 0.03598762025863103, 0.030001398268995467, 0.02307799866845805], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 253.73333333333335, 136, 517, 245.0, 445.00000000000006, 517.0, 517.0, 0.08446088616361763, 0.09808130380862289, 0.05458614693660366], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 25, 0, 0.0, 165.76000000000002, 128, 397, 135.0, 387.00000000000006, 396.7, 397.0, 0.1355976330077182, 0.10077128781139996, 0.06806365563082731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 25, 0, 0.0, 168.83999999999997, 128, 432, 136.0, 406.00000000000006, 426.9, 432.0, 0.13559689754298423, 0.060721985680967615, 0.0759660431469328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1056.857142857143, 783, 1187, 1059.0, 1187.0, 1187.0, 1187.0, 0.040912703979052695, 12.029693399465797, 0.02333302648805349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1339.0, 1136, 1570, 1352.0, 1570.0, 1570.0, 1570.0, 0.04092514206870746, 36.82451477214927, 0.023300154127008255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 319.57142857142856, 132, 421, 379.0, 421.0, 421.0, 421.0, 0.041096935929876885, 0.07272231240716495, 0.022755822922109564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 200.58333333333331, 128, 406, 136.0, 404.2, 406.0, 406.0, 0.06132555180220465, 0.04557494621238061, 0.030782552369466008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 176.58333333333334, 128, 407, 132.5, 404.90000000000003, 407.0, 407.0, 0.06132805912024899, 0.016410047069285373, 0.034976158717017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 289.58333333333337, 133, 428, 388.0, 421.40000000000003, 428.0, 428.0, 0.06124480057161814, 0.01650738765406895, 0.036005244086048944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 179.16666666666669, 133, 406, 136.0, 399.40000000000003, 406.0, 406.0, 0.06132649202244549, 0.016529406052924762, 0.036113158876498665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 172.7142857142857, 128, 397, 136.0, 397.0, 397.0, 397.0, 0.04116581590647127, 0.030592954985180304, 0.023115570455293923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 25, 0, 0.0, 324.08, 129, 1473, 134.0, 1366.2000000000003, 1461.3, 1473.0, 0.1356005749464378, 14.67379904503295, 0.0783199258264855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 826.2631578947369, 127, 1647, 431.0, 1638.0, 1647.0, 1647.0, 0.09204534444336789, 39.24479765920211, 0.0503656834366825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 25, 0, 0.0, 252.4, 127, 1048, 134.0, 877.2000000000005, 1037.8, 1048.0, 0.1356005749464378, 4.816691329021235, 0.07845234826295663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 564.1578947368421, 128, 1189, 395.0, 1094.0, 1189.0, 1189.0, 0.09204623627784399, 12.83315476666279, 0.05045606033630788], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 569.6, 138, 1996, 442.0, 1418.2000000000003, 1996.0, 1996.0, 0.08375723802131901, 0.017045906644182502, 0.05655249449994137], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 494.50000000000006, 263, 813, 535.5, 812.7, 813.0, 813.0, 0.061202007425843565, 0.09485115799298217, 0.13764474912277122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aee43fdd-5093-4a04-bd9e-530bd0854e52", 1, 0, 0.0, 819.0, 819, 819, 819.0, 819.0, 819.0, 819.0, 1.221001221001221, 0.22059104090354092, 0.8418231074481075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a877285-079a-40ea-a09a-a86f43f4584f", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 656.4347826086957, 144, 1422, 544.0, 1067.6000000000001, 1352.799999999999, 1422.0, 0.10699167325673349, 0.06572047117039587, 0.04837611788854259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 162.6842105263158, 129, 383, 136.0, 382.0, 383.0, 383.0, 0.09204400672405691, 0.06840379796582745, 0.04620177681266138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 243.0526315789474, 127, 531, 135.0, 514.0, 531.0, 531.0, 0.09204534444336789, 0.09011511723670187, 0.04883285594903595], "isController": false}, {"data": ["login", 23, 0, 0.0, 3151.217391304348, 2325, 4875, 3190.0, 3897.8, 4702.599999999998, 4875.0, 0.10532437618203715, 38.49182451728236, 0.21206637410531523], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5e6a88ac-1d46-42dd-a3d9-c9b5ad00a0ef", 3, 0, 0.0, 1319.0, 266, 2232, 1459.0, 2232.0, 2232.0, 2232.0, 0.08720676724513822, 0.03945879116886137, 0.05592361050550856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 25, 0, 0.0, 142.8, 134, 164, 140.0, 152.60000000000002, 161.29999999999998, 164.0, 0.14245663619994076, 0.11532866348608484, 0.050638882399197685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5fc18cb-bed4-40d0-98de-38f68253ff1a", 1, 0, 0.0, 1996.0, 1996, 1996, 1996.0, 1996.0, 1996.0, 1996.0, 0.501002004008016, 0.09051305736472946, 0.3454173972945892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec8088e3-e179-4e3a-9782-328ae3d4e47f", 3, 0, 0.0, 336.3333333333333, 256, 416, 337.0, 416.0, 416.0, 416.0, 0.03925571170605323, 0.025697668047159197, 0.025173747415665648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3f48b38-8d08-427b-9915-ff16f515fc58", 3, 0, 0.0, 481.0, 231, 728, 484.0, 728.0, 728.0, 728.0, 0.04593969649173851, 0.030073154181278042, 0.029460026721590128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b3f3ac8-6918-4835-a1bb-d444435affb5", 3, 0, 0.0, 435.6666666666667, 245, 584, 478.0, 584.0, 584.0, 584.0, 0.056412185031966905, 0.025525044659646483, 0.036175782719067316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1019.2105263157895, 267, 1784, 792.0, 1768.0, 1784.0, 1784.0, 0.09198429489196686, 52.201701966648436, 0.19572665626195193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c423025a-da1b-4430-b1ad-55059251b720", 3, 0, 0.0, 657.6666666666667, 226, 1350, 397.0, 1350.0, 1350.0, 1350.0, 0.04128137384412153, 0.026539945749394542, 0.026472756013320123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 588.2307692307692, 263, 1525, 274.0, 1522.6, 1525.0, 1525.0, 0.06310097612356141, 17.496158197180844, 0.13818981046651035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 904.0769230769232, 136, 1968, 1315.0, 1862.0, 1968.0, 1968.0, 0.07592083209231973, 48.916604250982594, 0.11539829601532434], "isController": false}, {"data": ["register", 25, 9, 36.0, 1203.1200000000001, 211, 2233, 1204.0, 2071.2000000000003, 2192.2, 2233.0, 0.10326865961410567, 0.0321746417610198, 0.04659191478683283], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 25, 0, 0.0, 515.84, 266, 1870, 278.0, 1501.6000000000004, 1780.8999999999999, 1870.0, 0.13549694860871733, 19.63696937701213, 0.30057563338048626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 158.84615384615387, 131, 381, 141.0, 288.19999999999993, 381.0, 381.0, 0.07566057502037014, 0.05874038783319754, 0.026894970026772203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 364.88235294117646, 262, 792, 277.0, 780.8, 792.0, 792.0, 0.13050019958854053, 0.2022498210420057, 0.29349800747305554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 136.4, 131, 145, 135.0, 145.0, 145.0, 145.0, 0.0256030805626533, 0.019027289363456212, 0.012851546298050583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 136.2, 134, 140, 136.0, 140.0, 140.0, 140.0, 0.0256030805626533, 0.006850824291178715, 0.01460175688338821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 191.8, 130, 424, 134.0, 424.0, 424.0, 424.0, 0.025602949459777768, 0.0069007949715807265, 0.015051733959752164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 133.2, 129, 136, 134.0, 136.0, 136.0, 136.0, 0.025604129433995114, 0.006901113011506496, 0.01507743168818267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c479232-6a98-45b1-9ffc-eb22b1f71673", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.9676846590909091, 1.8081202651515151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 141.33333333333334, 138, 144, 142.0, 144.0, 144.0, 144.0, 0.08852691218130312, 0.026108522928470258, 0.05472415567457507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8255c811-226d-4fe8-b8e1-f460c83561df", 3, 0, 0.0, 725.6666666666666, 217, 1131, 829.0, 1131.0, 1131.0, 1131.0, 0.03648170442523074, 0.023454220781194895, 0.023394843007065288], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1503.7017543859647, 1021, 2320, 1408.0, 2006.2, 2211.7999999999997, 2320.0, 0.2521666423347977, 301.67897154166724, 0.49793061601656335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1203.1200000000001, 211, 2233, 1204.0, 2071.2000000000003, 2192.2, 2233.0, 0.10072684491289143, 0.03138270761817274, 0.04544511948218344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 133.66666666666669, 128, 140, 133.0, 140.0, 140.0, 140.0, 0.031108553296728937, 0.008384727255758971, 0.018318806287038622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 181.66666666666669, 128, 419, 134.0, 419.0, 419.0, 419.0, 0.031109037175299423, 0.008384857676154923, 0.018288711308135013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 174.92307692307693, 127, 397, 137.0, 389.0, 397.0, 397.0, 0.07190384796207902, 0.01938033402102911, 0.04227159811833161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 172.69230769230768, 127, 398, 133.0, 397.6, 398.0, 398.0, 0.0720026142487635, 0.019406954621737034, 0.04239997694531678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 176.0, 128, 394, 133.5, 394.0, 394.0, 394.0, 0.03110887588077005, 0.008324054679034174, 0.017741780775751666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 136.30769230769232, 128, 146, 134.0, 144.8, 146.0, 146.0, 0.07199902524396594, 0.05350708809634577, 0.03614013571816259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 182.16666666666669, 134, 395, 137.5, 395.0, 395.0, 395.0, 0.031108553296728937, 0.023118758846494846, 0.015615035541522142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 197.0, 127, 411, 137.0, 409.8, 411.0, 411.0, 0.07200062031303654, 0.01926579098219923, 0.041062853772278654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3f48b38-8d08-427b-9915-ff16f515fc58", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 624.8666666666667, 137, 1459, 478.0, 1393.6000000000001, 1459.0, 1459.0, 0.08303165166561492, 0.016444159138463584, 0.056500444219336414], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 145.33333333333334, 135, 168, 142.5, 168.0, 168.0, 168.0, 0.03199488081906895, 0.025183470644696847, 0.011373180291153416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1639.521739130435, 928, 3020, 1569.0, 2719.2000000000003, 2967.5999999999995, 3020.0, 0.10887934748133665, 0.056353568520613705, 0.050080246741903874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 367.3333333333333, 268, 815, 277.0, 815.0, 815.0, 815.0, 0.03108647220351277, 0.04817796033884255, 0.0699142045748925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e6a88ac-1d46-42dd-a3d9-c9b5ad00a0ef", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/982e0053-1598-44cc-a5e7-05f50c87d49b", 3, 0, 0.0, 487.3333333333333, 242, 753, 467.0, 753.0, 753.0, 753.0, 0.07231703789412786, 0.03272157639089769, 0.046375183805804646], "isController": false}, {"data": ["addBook", 53, 19, 35.84905660377358, 1337.7358490566037, 663, 2582, 1041.0, 2324.8, 2438.6, 2582.0, 0.26191723415400736, 89.76614292743163, 0.9476450459343526], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24cd4c3e-3c19-43ff-931f-d48b8c2f17e9", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 247.49122807017545, 129, 580, 141.0, 540.0, 552.0, 580.0, 0.2535000800526569, 0.18839214933600767, 0.12254154260357925], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 878.0526315789474, 633, 1307, 802.0, 1145.0000000000002, 1199.6, 1307.0, 0.2532365406999991, 74.45995121031517, 0.12736017427783158], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 214.12280701754383, 128, 548, 139.0, 400.2, 408.1, 548.0, 0.2539744777928281, 0.4494157751568404, 0.12351493158284024], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1252.298245614035, 881, 1766, 1228.0, 1484.0, 1633.6999999999996, 1766.0, 0.2527884338204315, 227.4594771062931, 0.1268879443200213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 172.23529411764707, 130, 418, 140.0, 400.4, 418.0, 418.0, 0.1314487195348262, 0.09820143598060745, 0.046725912022145245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 19, 11.656441717791411, 200.8650306748466, 127, 1107, 142.0, 359.79999999999995, 453.9999999999995, 1019.959999999998, 0.6933721281419754, 1.6322027751900392, 0.3267753769413356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 143.8, 138, 152, 140.0, 152.0, 152.0, 152.0, 0.02629696638195818, 0.020364740567278158, 0.009347749768586697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aee43fdd-5093-4a04-bd9e-530bd0854e52", 3, 0, 0.0, 534.6666666666666, 234, 853, 517.0, 853.0, 853.0, 853.0, 0.04548693766773308, 0.029243718064379177, 0.029169683335102267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a877285-079a-40ea-a09a-a86f43f4584f", 3, 0, 0.0, 516.0, 267, 840, 441.0, 840.0, 840.0, 840.0, 0.04830762294290039, 0.031057146911532642, 0.030978521223149015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 141.07692307692307, 129, 174, 136.0, 167.6, 174.0, 174.0, 0.06231156742351255, 0.05056729739154193, 0.02214981498257673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5fc18cb-bed4-40d0-98de-38f68253ff1a", 3, 0, 0.0, 374.3333333333333, 269, 583, 271.0, 583.0, 583.0, 583.0, 0.03821412648875868, 0.02456800124195911, 0.024505803770460483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 330.4, 267, 569, 271.0, 569.0, 569.0, 569.0, 0.02558500104898504, 0.03965175455540944, 0.05754126700762945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ce4d8da-e1ae-469b-99b4-985721c4645e", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.7923968672456575, 1.480594758064516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 375.38461538461536, 268, 551, 281.0, 547.8, 551.0, 551.0, 0.07184860945306629, 0.11135131172071892, 0.1615892066117301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec8088e3-e179-4e3a-9782-328ae3d4e47f", 1, 0, 0.0, 989.0, 989, 989, 989.0, 989.0, 989.0, 989.0, 1.0111223458038423, 0.18267347067745196, 0.6971214610717897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8255c811-226d-4fe8-b8e1-f460c83561df", 1, 0, 0.0, 1033.0, 1033, 1033, 1033.0, 1033.0, 1033.0, 1033.0, 0.968054211035818, 0.17489260648596322, 0.6674280009680542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c423025a-da1b-4430-b1ad-55059251b720", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 163.0, 135, 386, 139.5, 318.80000000000024, 386.0, 386.0, 0.06385356249667429, 0.05294108843718406, 0.02269794604373969], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bfce2d27-288a-47c1-9dc3-a3129c5e957b", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee0d71e7-5884-4b28-80ed-8baa55b5de75", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.8970110603932585, 1.6760665379213484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 143.6315789473684, 131, 159, 143.0, 154.0, 159.0, 159.0, 0.0895482995249227, 0.06952236144757183, 0.03183162209674987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b3f3ac8-6918-4835-a1bb-d444435affb5", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e4c004e-a8c7-4b4d-b59b-28832decf10c", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.9825721153846153, 1.8359375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 164.35294117647058, 126, 395, 135.0, 383.0, 395.0, 395.0, 0.13089912297587605, 0.09727952400843913, 0.06570522383750028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 131.94117647058823, 126, 144, 132.0, 141.6, 144.0, 144.0, 0.1309001309001309, 0.03502601158851159, 0.0746539809039809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 197.6470588235294, 127, 406, 135.0, 402.8, 406.0, 406.0, 0.13063457666712772, 0.035210100742311776, 0.07679884292344814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 179.8235294117647, 129, 397, 136.0, 396.2, 397.0, 397.0, 0.13065164428937032, 0.03521470099986935, 0.07693646631493195], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 22.5, 0.6976744186046512], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 7.5, 0.23255813953488372], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.5, 0.23255813953488372], "isController": false}, {"data": ["401/Unauthorized", 25, 62.5, 1.937984496124031], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1290, 40, "401/Unauthorized", 25, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
